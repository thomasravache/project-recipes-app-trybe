import React, { useState, useEffect } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { useHistory } from 'react-router';
import './styles/profile.css';

const Profile = () => {
  const [email, setEmail] = useState('alguem@alguem.com');
  const history = useHistory();

  // Pego o email que está no local storage na montagem do componente e seto ele no estado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setEmail(user.email);
  }, []);

  // Limpa o local storage e retorna pra tela inicial
  const logout = () => {
    localStorage.clear();
    history.push('/');
  };

  /* Parametro 'route' é a rota da pagina que deve ser dado o push
  exemplo: se eu passo por parametro '/', vai pra tela inicial. */
  const handleClick = (route) => {
    history.push(route);
  };

  return (
    <div className="text-center">
      <h4 data-testid="profile-email">
        { email }
      </h4>
      <Stack gap={ 2 } className="col-md-5 mx-auto mt-4">
        <Button
          variant="success"
          data-testid="profile-done-btn"
          onClick={ () => handleClick('/receitas-feitas') }
        >
          Receitas Feitas
        </Button>

        <Button
          variant="success"
          onClick={ () => handleClick('/receitas-favoritas') }
          data-testid="profile-favorite-btn"
        >
          Receitas Favoritas
        </Button>

        <Button
          variant="danger"
          data-testid="profile-logout-btn"
          onClick={ logout }
        >
          Sair
        </Button>
      </Stack>
    </div>
  );
};

export default Profile;
