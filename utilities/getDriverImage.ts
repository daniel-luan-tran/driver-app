export const getImage = (type: string) => {
  switch (type) {
    case 'Car':
      return require('../assets/images/car.png');
    case 'Van':
      return require('../assets/images/van.png');
    case 'Moto':
      return require('../assets/images/moto.png');
    case 'Current':
      return require('../assets/images/current.png');
    case 'UserLocation':
      return require('../assets/images/user-location.png');
    default:
      return;
  }
};
