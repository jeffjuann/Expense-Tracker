import { Box, HamburgerIcon, ScrollView, Text, Button } from 'native-base';
import { View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useRef } from 'react';
import Card from '../components/ui/transCard';
import { transaction } from "../types/type";
import { DrawerNavigationProp } from '@react-navigation/drawer';


export default function History({ navigation }: { navigation: DrawerNavigationProp<any>}) 
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
      <ScrollView style={{ flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <Box
          style={{
            paddingTop: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 28,
            paddingHorizontal: 24,
          }}
        >
          <Button
            style={{
              backgroundColor: '#00000000',
              width: 28,
              height: 28,
            }}
            onPress={() => navigation.openDrawer()}
          >
            <HamburgerIcon
              size="7"
              color='#000000'
            />
          </Button>
          <Text fontSize="xl" bold>History</Text>
        </Box>

        <Box
          style={{
            paddingTop: 20,
          }}>
          {transactions.map((transaction: transaction) =>
          {
            return (
              <Card transactionProps={transaction}/>
            )
          })}
        </Box>
      </ScrollView>
    </View>
  );
}