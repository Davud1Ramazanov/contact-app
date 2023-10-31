import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';


export default function CreateContact() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [imageUri, setImageUri] = useState('');

  const permissionFunction = async () => {
    const mediaPermission = await MediaLibrary.getPermissionsAsync();
    const contactPermission = await Contacts.requestPermissionsAsync();

    setGalleryPermission(mediaPermission.status === 'granted');

    if (mediaPermission.status !== 'granted' || contactPermission.status !== 'granted') {
      alert('Permission for media and contacts access needed.');
    }
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    } else {
      console.log("Error");
    }
  };

  const createContact = async () => {
    try {
      if (!galleryPermission) {
        alert('Permission for media access needed.');
        return;
      }

      const contact = {
        [Contacts.Fields.FirstName]: name,
        [Contacts.Fields.PhoneNumbers]: [
          {
            label: Contacts.Fields.PhoneNumbers.Mobile,
            number: number,
          },
        ],
      };

      if (imageUri) {
        const asset = await MediaLibrary.createAssetAsync(imageUri);
        contact[Contacts.Fields.Image] = asset.uri;
      }

      const { status } = await Contacts.requestPermissionsAsync();

      if (status === 'granted') {
        await Contacts.addContactAsync(contact);
        alert('Successfully created contact!');
      } else {
        console.error('Permission to access contacts denied');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };


  useEffect(() => {
    permissionFunction();
  }, []);


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Input name"
        value={name}
        onChangeText={(newText) => {
          setName(newText);
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Input number"
        value={number}
        onChangeText={(newText) => {
          setNumber(newText);
        }}
      />
      <TouchableOpacity style={styles.button} onPress={() => { pickImage() }}>
        <Text style={styles.buttonText}>Add Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { createContact() }}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
