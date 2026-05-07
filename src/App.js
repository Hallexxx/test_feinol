import { useState } from "react";
import { validateForm } from "./validators";

/**
 * Application principale.
 *
 * @returns {JSX.Element} Formulaire d'inscription.
 */
function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    postalCode: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage("");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));
    setErrors({});
    setMessage("Utilisateur enregistré");
  };

  return (
    <div>
      <h1>Formulaire d'inscription</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="email">Mail</label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="birthDate">Date de naissance</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
          {errors.birthDate && <p>{errors.birthDate}</p>}
        </div>

        <div>
          <label htmlFor="city">Ville</label>
          <input
            id="city"
            name="city"
            type="text"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p>{errors.city}</p>}
        </div>

        <div>
          <label htmlFor="postalCode">Code postal</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleChange}
          />
          {errors.postalCode && <p>{errors.postalCode}</p>}
        </div>

        <button type="submit">Envoyer</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;