// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import api from '../services/api';

// function Register() {

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');

//   const navigate = useNavigate();


//   const handleChange = (e) => {

//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });

//   };


//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     try {

//       await api.post('/auth/register', formData);

//       // Registration successful
//       navigate('/login');

//     } catch (err) {

//       setError(
//         err.response?.data?.message || 'Registration failed'
//       );

//     }

//   };


//   return (
//     <div className="container">

//       <h2>Register</h2>

//       {error && (
//         <div className="error">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>

//         <div>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             minLength="6"
//           />
//         </div>

//         <button type="submit">
//           Register
//         </button>

//       </form>

//       <p>
//         Already have an account?
//         <Link to="/login"> Login</Link>
//       </p>

//     </div>
//   );
// }

// export default Register;