#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
BASE_URL="https://localhost/api/v1"

#BASE_URL="https://timely.tier-zero.co.uk/api/v1"

COOKIE_JAR="cookies.txt"
# Clean up cookie jar on exit
trap 'rm -f "$COOKIE_JAR"' EXIT

# --- Helper Functions ---
log() {
  echo "[INFO] $1"
}

# --- Test Steps ---

# 1. Generate a unique user for this test run
RANDOM_SUFFIX=$(date +%s%N | sha256sum | head -c 8)
USER_EMAIL="testuser_${RANDOM_SUFFIX}@example.com"
USER_NAME="Test User ${RANDOM_SUFFIX}"
USER_PASSWORD="strongpassword123"

log "Starting E2E test..."
log "Using user email: $USER_EMAIL"

# 2. Register a new user and log in (the registration API sets the auth cookie)
log "Registering new user..."
if ! REGISTRATION_RESPONSE=$(curl -k -s -X POST "${BASE_URL}/users" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_JAR" \
  -d @- <<EOF
{
  "name": "${USER_NAME}",
  "email": "${USER_EMAIL}",
  "password": "${USER_PASSWORD}"
}
EOF
); then
  echo "[ERROR] curl command failed. Is the server running at ${BASE_URL}?"
  exit 1
fi


# Check that registration was successful (HTTP 201 Created and returns user data)
USER_ID=$(echo "$REGISTRATION_RESPONSE" | jq -r '.email')
if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
  echo "[ERROR] User registration failed. Response: $REGISTRATION_RESPONSE"
  exit 1
fi
log "User registered successfully. User ID: $USER_ID"

# 3. Create a new product reminder using the session cookie
log "Creating a product reminder..."
REMINDER_PAYLOAD=$(cat <<EOF
{
  "name": "Test Price Drop Reminder",
  "urls": ["https://www.amazon.com/Precision-Touchscreen-Control-Accurate-Temperature/dp/B0F1TQ8X1T/"],
  "reminderDetails": {
    "type": "priceDrop",
    "initialPrice": {
      "amount": 10,
      "currency": "USD"
    },
    "targetPrice": {
      "amount": 2,
      "currency": "USD"
    }
  }
}
EOF
)

CREATE_RESPONSE=$(curl -k -s -X POST "${BASE_URL}/product-reminders" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_JAR" \
  -d "$REMINDER_PAYLOAD"
)

# 4. Verify the reminder was created successfully
PRODUCT_ID=$(echo "$CREATE_RESPONSE" | jq -r '.productId')
if [ -z "$PRODUCT_ID" ] || [ "$PRODUCT_ID" == "null" ]; then
  echo "[ERROR] Failed to create product reminder. Response: $CREATE_RESPONSE"
  exit 1
fi

log "Product reminder created successfully. Product ID: $PRODUCT_ID"

# 5. Update the product reminder
log "Updating the product reminder..."
UPDATED_NAME="Updated_Test_Product_Reminder"
UPDATE_PAYLOAD=$(cat <<EOF
{
  "name": "${UPDATED_NAME}",
  "urls": ["https://www.amazon.com/Precision-Touchscreen-Control-Accurate-Temperature/dp/B0F1TQ8X1T/"],
  "reminderDetails": {
    "type": "priceDrop",
    "initialPrice": {
      "amount": 10000,
      "currency": "USD"
    },
    "targetPrice": {
      "amount": 8500,
      "currency": "USD"
    }
  }
}
EOF
)

UPDATE_RESPONSE=$(curl -k -s -X PUT "${BASE_URL}/product-reminders/${PRODUCT_ID}" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_JAR" \
  -d "$UPDATE_PAYLOAD"
)

# Verify the update was successful (HTTP 200 OK)
if echo "$UPDATE_RESPONSE" | jq -e '.productId == "'$PRODUCT_ID'"' > /dev/null; then
  log "Product reminder updated successfully."
else
  echo "[ERROR] Failed to update product reminder. Response: $UPDATE_RESPONSE"
  exit 1
fi

# 6. Read all product reminders for the user again to verify the update
log "Reading all product reminders after update..."
READ_REMINDERS_RESPONSE_AFTER_UPDATE=$(curl -k -s -X GET "${BASE_URL}/product-reminders" \
  -b "$COOKIE_JAR" \
  -H "Accept: application/json"
)

log "All product reminders for user after update:\n$READ_REMINDERS_RESPONSE_AFTER_UPDATE"

# Verify the updated reminder is in the list and has the new name
if echo "$READ_REMINDERS_RESPONSE_AFTER_UPDATE" | jq -e '.[] | select(.productId == "'$PRODUCT_ID'" and .name == "'${UPDATED_NAME}'")' > /dev/null; then
  log "Successfully found the updated product reminder with the new name in the list."
else
  echo "[ERROR] Updated product reminder not found or name not updated in the list of all reminders."
  exit 1
fi

log "E2E test completed successfully!"

# 7. Delete the product reminder
log "Deleting the product reminder..."
DELETE_RESPONSE=$(curl -k -s -X DELETE "${BASE_URL}/product-reminders/${PRODUCT_ID}" \
  -b "$COOKIE_JAR"
)

# Verify deletion was successful (HTTP 204 No Content or similar, or check for empty response)
if [ -z "$DELETE_RESPONSE" ]; then
  log "Product reminder deleted successfully."
else
  echo "[ERROR] Failed to delete product reminder. Response: $DELETE_RESPONSE"
  exit 1
fi

# 8. Read all product reminders for the user after deletion to verify no products are left
log "Reading all product reminders after deletion..."
READ_REMINDERS_RESPONSE_AFTER_DELETE=$(curl -k -s -X GET "${BASE_URL}/product-reminders" \
  -b "$COOKIE_JAR" \
  -H "Accept: application/json"
)

log "All product reminders for user after deletion:\n$READ_REMINDERS_RESPONSE_AFTER_DELETE"

# Verify the list of reminders is empty
if echo "$READ_REMINDERS_RESPONSE_AFTER_DELETE" | jq -e '. | length == 0' > /dev/null; then
  log "Successfully verified that no product reminders are left for the user."
else
  echo "[ERROR] Product reminders still found after deletion. Response: $READ_REMINDERS_RESPONSE_AFTER_DELETE"
  exit 1
fi

log "E2E test completed successfully with creation, update, and deletion verification!"

exit 0
