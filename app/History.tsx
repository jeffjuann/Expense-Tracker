import { ScrollView, VStack } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/transCard';
import { transaction } from "../types/type";


export default function History() 
{
  const isInitialMount = useRef(true);
  const db = SQLite.openDatabase("example.db");
  const [transactions, setTransactions] = useState<transaction[]>([]);
  
  function getTransaction()
  {
    db.transaction(tx => 
    {
      tx.executeSql('SELECT * FROM trLog ORDER BY date DESC', undefined,
      (txObj, resultSet) => setTransactions(resultSet.rows._array),
      (txObj, error) =>
      {
        console.log(error);
        return true;
      }
      );
    });
  }

  useEffect(() =>
  {
    if(isInitialMount.current === true)
    {
      db.transaction(tx => 
      {
        tx.executeSql('CREATE TABLE IF NOT EXISTS trLog ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER, type TEXT, date TEXT )');
      })
      getTransaction();
      isInitialMount.current = false;
    }
  }, [transactions])

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF'}}>
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