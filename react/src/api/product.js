export async function createProductReminder(productReminderData) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product-reminders`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productReminderData),
  })

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function getProductReminders() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/product-reminders`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function updateProductReminderById(
  productId,
  productReminderData
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/product-reminders/${productId}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productReminderData),
    }
  )

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function deleteProductReminderById(productId) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/v1/product-reminders/${productId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  // For 204 No Content response, return success without parsing JSON
  if (res.status === 204) {
    return { success: true }
  }

  // For other successful responses, try to parse JSON
  return res.json()
}
