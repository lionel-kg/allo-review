import {createContext, useContext, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import {apiAuth} from '@/config/axios';

const UserContext = createContext(null);

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = Cookies.get('jwt');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await apiAuth.get(
            `${process.env.AUTH_API_BASE_URL}/auth/user`,
            {
              headers: {Authorization: `Bearer ${storedToken}`},
            },
          );
          setUser(response.data.user);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error,
          );
        }
      }
    };

    fetchUser();
  }, [Cookies.get('jwt')]);

  return (
    <UserContext.Provider value={{user, token, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
