/**
 * Vérifie si un nom, prénom ou une ville est valide.
 *
 * @param {string} value - Valeur à vérifier.
 * @returns {boolean} true si la valeur est valide.
 */
function isValidText(value) {
  if (typeof value !== "string") {
    return false;
  }

  if (value.trim().length < 2) {
    return false;
  }

  return /^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/.test(value);
}

/**
 * Vérifie si un email est valide.
 *
 * @param {string} email - Email à vérifier.
 * @returns {boolean} true si l'email est valide.
 */
function isValidEmail(email) {
  if (typeof email !== "string") {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Vérifie si un code postal français est valide.
 *
 * @param {string} postalCode - Code postal à vérifier.
 * @returns {boolean} true si le code postal est valide.
 */
function isValidPostalCode(postalCode) {
  if (typeof postalCode !== "string") {
    return false;
  }

  return /^[0-9]{5}$/.test(postalCode);
}

/**
 * Vérifie si l'utilisateur a au moins 18 ans.
 *
 * @param {string} birthDate - Date de naissance.
 * @param {Date} currentDate - Date utilisée pour le test.
 * @returns {boolean} true si l'utilisateur est majeur.
 */
function isAdult(birthDate, currentDate = new Date()) {
  if (!birthDate) {
    return false;
  }

  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return false;
  }

  let age = currentDate.getFullYear() - birth.getFullYear();

  const monthDiff = currentDate.getMonth() - birth.getMonth();
  const dayDiff = currentDate.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 18;
}

/**
 * Valide tout le formulaire.
 *
 * @param {Object} user - Données du formulaire.
 * @returns {Object} Objet contenant les erreurs.
 */
function validateForm(user) {
  const errors = {};

  if (!isValidText(user.firstName)) {
    errors.firstName = "Prénom invalide";
  }

  if (!isValidText(user.lastName)) {
    errors.lastName = "Nom invalide";
  }

  if (!isValidEmail(user.email)) {
    errors.email = "Email invalide";
  }

  if (!isAdult(user.birthDate)) {
    errors.birthDate = "Vous devez avoir au moins 18 ans";
  }

  if (!isValidText(user.city)) {
    errors.city = "Ville invalide";
  }

  if (!isValidPostalCode(user.postalCode)) {
    errors.postalCode = "Code postal invalide";
  }

  return errors;
}

module.exports = {
  isValidText,
  isValidEmail,
  isValidPostalCode,
  isAdult,
  validateForm
};