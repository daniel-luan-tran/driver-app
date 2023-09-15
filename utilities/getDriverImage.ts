export const getImage = (type: string) => {
  switch (type) {
    case "Car":
      return require("../assets/images/car.png");
    case "Van":
      return require("../assets/images/van.png");
    case "Moto":
      return require("../assets/images/moto.png");
    default:
      return;
  }
};