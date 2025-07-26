#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
BASE_URL="http://localhost:3000/api/v1"
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
if ! REGISTRATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/users" \
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
USER_ID=$(echo "$REGISTRATION_RESPONSE" | jq -r '.userId')
if [ -z "$USER_ID" ] || [ "$USER_ID" == "null" ]; then
  echo "[ERROR] User registration failed. Response: $REGISTRATION_RESPONSE"
  exit 1
fi
log "User registered successfully. User ID: $USER_ID"

# 3. Create a new product reminder using the session cookie
log "Creating a product reminder..."
REMINDER_PAYLOAD=$(cat <<EOF
{
  "name": "Test Product Reminder",
  "urls": ["https://example.com/product/${RANDOM_SUFFIX}"],
  "reminderDetails": {
    "type": "targetDate",
    "targetDate": "2025-12-31"
  }
}
EOF
)

CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/product-reminders" \
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

# 5. Read all product reminders for the user
log "Reading all product reminders..."
READ_REMINDERS_RESPONSE=$(curl -s -X GET "${BASE_URL}/product-reminders" \
  -b "$COOKIE_JAR" \
  -H "Accept: application/json"
)

log "All product reminders for user:\n$READ_REMINDERS_RESPONSE"

# Optional: Add a basic check to ensure the created reminder is in the list
if echo "$READ_REMINDERS_RESPONSE" | jq -e '.[] | select(.productId == "'"$PRODUCT_ID"'")' > /dev/null; then
  log "Successfully found the created product reminder in the list."
else
  echo "[ERROR] Created product reminder not found in the list of all reminders."
  exit 1
fi

log "E2E test completed successfully!"

exit 0
