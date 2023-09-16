import { VStack } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export default function History() 
{
  const db = SQLite.openDatabase("examples.db");
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useEffect(() =>
  {
    db.transaction(tx => 
    {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transactions ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER, type TEXT, date DATE )'
      );
    })

    db.transaction(tx => 
    {
      tx.executeSql(
        'SELECT * FROM transactions', 
        [null],
        (txObj, resultSet) => setTransactions(resultSet.rows._array),
        (txObj, error) =>
        {
          console.log(error);
          return true;
        }
      );
    })
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <VStack style={styles.transactionList}>
        {transactions.map((transaction) =>
              {
                return (
                  <>
                    <Text>Name : {transaction.name}</Text>
                    <Text>Amount : {transaction.amount}</Text>
                    <Text>Date : {transaction.date}</Text>
                    <Text>Type : {transaction.type}</Text>
                  </>
                )
              })}
      </VStack>
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
  transactionList: {
    flexDirection: 'column'
  }
});