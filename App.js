import { createAppContainer, createStackNavigator } from "react-navigation";
// import Reactotron from './ReactotronConfig';
import routeConfig from "./src/routeConfig";

export default createAppContainer(createStackNavigator(routeConfig));
