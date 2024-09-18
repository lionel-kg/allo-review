import {useEffect} from 'react';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Stocker le token dans les cookies
      Cookies.set('jwt', token, {expires: 7}); // Le token est stocké pour 7 jours

      // Redirection vers la page souhaitée après stockage du token
      router.push('/movies');
    } else {
      // Redirection vers la page de connexion si le token est manquant
      router.push('/login');
    }
  }, [router]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;
