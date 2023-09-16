import { ScrollView, VStack } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/transCard';
import { transaction } from "../types/type";


export default function History() 
{
  const isInitialMount = useRef(true);
  const db = SQLite.openDatabase("example1.db");
  const [transactions, setTransactions] = useState<transaction[]>([]);
  
  function getTransaction()
  {
    db.transaction(tx => 
    {
      tx.executeSql('SELECT * FROM transactions ORDER BY date DESC', undefined,
      (txObj, resultSet) => setTransactions(resultSet.rows._array),
      (txObj, error) =>
      {
        console.log(error);
        return true;
      }
      );
      console.log('test');
      console.log(transactions);
    });
  }

  useEffect(() =>
  {
    if(isInitialMount.current === true)
    {
      db.transaction(tx => 
      {
        tx.executeSql('CREATE TABLE IF NOT EXISTS transactions ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER, type TEXT, date TEXT )');
      })
      getTransaction();
      isInitialMount.current = false;
    }
  }, [transactions])

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F6'}}>
      <ScrollView style={{ flexGrow: 1, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
        {transactions.map((transaction: transaction) =>
        {
          return (
            <Card transactionProps={transaction}/>
          )
        })}
      </ScrollView>
    </View>
  );
}