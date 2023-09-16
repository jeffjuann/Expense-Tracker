import { View, Text, StyleSheet } from 'react-native';

export default function AboutUs() 
{
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  separator: {
    height: 1,
    marginVertical: 30,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});