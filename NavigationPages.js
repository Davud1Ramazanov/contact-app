import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ContactList from './ContactList';
import CreateContact from './CreateContact';
const Stack = createStackNavigator();

export default function NavigatePages() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Contacts">
                <Stack.Screen name="Contact list" component={ContactList} />
                <Stack.Screen name="Create contact" component={CreateContact} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}