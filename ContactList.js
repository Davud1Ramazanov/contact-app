import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);

  const getContacts = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync();
      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  const addContact = () => {
    navigation.navigate('Create contact');
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.phoneCard}>
            <Image source={{uri: item.image}}></Image>
            <Text>Name: {item.name}</Text>
            <Text>Phone: {item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'N/A'}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.buttonAdd} onPress={() => {addContact()}}><Text style={{ fontSize: 30 }}>+</Text></TouchableOpacity>
    </View>
  );
};

const styles = new StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 35,
    margin: 10,
    flex: 1,
  },
  phoneCard: {
    borderColor: '#e0e0e0',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    padding: 15,
    elevation: 5,
  },
  buttonAdd: {
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: 'black',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20
  }
})

export default ContactList;