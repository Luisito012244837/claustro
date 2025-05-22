// authHelper.js
export const fetchWithAuth = async (url, options = {}) => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // Configuración básica de headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Si el token expiró, intentamos renovarlo
    if (response.status === 401 && refreshToken) {
      try {
        const refreshResponse = await fetch('http://10.10.1.1:8000/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Error al renovar el token');
        }

        const { access } = await refreshResponse.json();
        localStorage.setItem('accessToken', access);
        
        // Reintentamos la petición original con el nuevo token
        headers['Authorization'] = `Bearer ${access}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (refreshError) {
        // Si no podemos renovar, redirigimos a login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};