export function safeError(error) {
  const messages = { invalid_credentials: 'Email or password is incorrect.', email_not_confirmed: 'Confirm your email before signing in.', weak_password: 'Choose a stronger password with at least 8 characters.', over_email_send_rate_limit: 'Please wait a moment before requesting another email.', over_request_rate_limit: 'Too many attempts. Please try again shortly.', session_not_found: 'Your session has expired. Sign in again.', same_password: 'Choose a different password.', otp_expired: 'This email link has expired. Request a new link.' }
  return messages[error?.code] || 'Unable to complete this request. Please try again.'
}
export function identityLabels(identities = []) {
  return [...new Set(identities.map(identity => identity.provider).filter(value => typeof value === 'string'))].map(provider => ({ email: 'Email and password', google: 'Google', github: 'GitHub', apple: 'Apple' })[provider] || provider)
}
