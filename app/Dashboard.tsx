import { View, SafeAreaView } from 'react-native';
import { Text, Button, Modal, Center, FormControl, Input, Divider, ScrollView } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { transaction } from './../types/type';
import Card from '../components/ui/transCard';

// FORMAT
import { formatDate } from '../components/dateFormat';
import { formatRupiah } from '../components/currencyFormat';

export default function Dashboard() 
{
  const isInitialMount = useRef(true);
  const db = SQLite.openDatabase("example1.db");
  const [ transactions, setTransactions ] = useState<transaction[]>([]);
  const [ totalBalance, setTotalBalance ] = useState<number>(0);
  const [ weeklyBalance, setWeeklyBalance ] = useState<number>(0);

  
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

  function getTotalBalance()
  {
    db.transaction(tx => 
    {
      tx.executeSql('SELECT SUM(amount) as total FROM trLog', undefined,
      (txObj, resultSet) => setTotalBalance(resultSet.rows._array[0].total),
      (txObj, error) =>
      {
        console.log(error);
        return true;
      }
      );
    });
  }

  function getWeekRangeDB()
  {
    // GET MONDAY
    var d = new Date();
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0,0,0,0);
    // GET SUNDAY
    const sunday = new Date();
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(0,0,0,0);
    return '\'' + monday.toISOString() + '\' AND \'' + sunday.toISOString() + '\'';
  }

  function getWeeklyBalance()
  {
    db.transaction(tx => 
    {
      tx.executeSql(`SELECT SUM(amount) as total FROM trLog WHERE date BETWEEN ${getWeekRangeDB()}`, undefined,
      (txObj, resultSet) => setWeeklyBalance(resultSet.rows._array[0].total),
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
    getTotalBalance();
    getWeeklyBalance();
  }, [transactions])

  const [showModalE, setShowModalE] = useState(false);
  const [expenseValue, setExpenseValue] = useState<transaction>({
    name: '',
    amount: 0,
    type: 'EXPENSE'
  })

  const addExpense = () =>
  {
    db.transaction(tx =>
      {
        const date = new Date();
        tx.executeSql('INSERT INTO trLog (name, amount, type, date) values (?, ?, \'EXPENSE\', ?)', [expenseValue.name, -(expenseValue.amount), date.toISOString()],
        (txObj, resultSet) =>
        {
          const temp: transaction = 
          {
            id: resultSet.insertId,
            name: incomeValue.name,
            amount: incomeValue.amount,
            type: 'INCOME', 
            date: date.toISOString()
          }
          setTransactions(transactions => [temp, ...transactions]);
        },
        (txObj, err) =>
        {
          console.log(err);
          return true;
        }
        );
      }
    )
    setExpenseValue({
      name: '',
      amount: 0,
      type: 'EXPENSE'
    })
    getTransaction();
    console.log(transactions);
  }

  const [showModalI, setShowModalI] = useState(false);
  const [incomeValue, setIncomeValue] = useState<transaction>({
    name: '',
    amount: 0,
    type: 'INCOME'
  })

  const addIncome = () =>
  {
    db.transaction(tx =>
      {
        const date = new Date();
        tx.executeSql('INSERT INTO trLog (name, amount, type, date) values (?, ?, \'INCOME\', ?)', [incomeValue.name, incomeValue.amount, date.toISOString()],
        (txObj, resultSet) =>
        {
          const temp: transaction = 
          {
            id: resultSet.insertId,
            name: incomeValue.name,
            amount: incomeValue.amount,
            type: 'INCOME', 
            date: date.toISOString()
          }
          setTransactions(transactions => [temp, ...transactions]);
        },
        (txObj, err) =>
        {
          console.log(err);
          return true;
        }
        );
      }
    )
    setIncomeValue({
      name: '',
      amount: 0,
      type: 'INCOME'
    })
    getTransaction();
    console.log(transactions);
  }


  function getWeekRange()
  {
    // GET STARTING DAY
    var d = new Date();
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));

    // GET SUNDAY
    const sunday = new Date();
    sunday.setDate(monday.getDate() + 6);
    // console.log(formatDate(monday) + ' - ' + formatDate(sunday));
    return formatDate(monday) + ' - ' + formatDate(sunday);
  }

  function setExpenseAmount(number: number)
  {
    if(isNaN(number)) setExpenseValue({ ...expenseValue, amount: 0 });
    else setExpenseValue({ ...expenseValue, amount: number });
  }

  function setIncomeAmount(number: number)
  {
    if(isNaN(number)) setIncomeValue({ ...incomeValue, amount: 0 });
    else setIncomeValue({ ...incomeValue, amount: number });
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: '100%',
      }}
    >
      <ScrollView>
        {/* Header */}
        <View 
          style={{
            paddingHorizontal: 24,
            backgroundColor: '#4790FC',
            paddingTop: 148,
            paddingBottom: 48,
            
          }}
        >
          <Text fontSize="xl" bold>Your Balance</Text>
          <Text fontSize="3xl" bold>{formatRupiah(totalBalance)}</Text>
        </View>

        {/* Content */}
        <View 
          style={{
            backgroundColor: '#FAF9F6',
            flex: 1,
            gap: 16,
            height: '100%'
          }}
        >
          {/* Bordering */}
          <View 
            style={{
              position: 'absolute',
              width: '100%',
              height: 16,
              backgroundColor: '#FFFFFF',
              borderTopStartRadius: 16,
              borderTopEndRadius: 16,
              transform: [{translateY: -16}],
            }}/>

          {/* Action Section */}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              gap: 24,
              paddingTop: 16,
            }}
          >
            {/* Add Expense Popup */}
            <Center> 
              <Button 
                onPress={() => setShowModalE(true)} 
                _text={{
                  color: "#7F1D1D"
                }}
                style={{
                  backgroundColor: '#FCA5A5',
                  marginHorizontal: 12,
                  marginVertical: 10
                }}
              >
                Add Expense
              </Button>
              <Modal isOpen={showModalE} onClose={() => setShowModalE(false)}>
                <Modal.Content maxWidth="400px">
                  <Modal.CloseButton />
                  <Modal.Header>Add Expense</Modal.Header>
                  <Modal.Body>
                    <FormControl>
                      <FormControl.Label>Name</FormControl.Label>
                      <Input 
                        type='text' 
                        value={expenseValue.name} 
                        onChangeText={val => setExpenseValue({ ...expenseValue, name: val })}/>
                    </FormControl>
                    <FormControl mt="3">
                      <FormControl.Label>Amount</FormControl.Label>
                      <Input  
                        type='text' 
                        value={expenseValue.amount.toString()}
                        onKeyPress={(event: any) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChangeText={val => setExpenseAmount(parseInt(val))}/>
                    </FormControl>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        onPress={() => 
                        {
                          setShowModalE(false);
                        }}
                        _text={{
                          color: "#141414"
                        }}
                        style={{
                          borderColor: '#000000',
                          borderWidth: 1,
                          backgroundColor: 'rgb(0,0,0,0)',
                          paddingHorizontal: 12,
                          paddingVertical: 10
                        }}  
                      >
                        Cancel
                      </Button>
                      <Button 
                        onPress={() =>
                        {
                          setShowModalE(false);
                          addExpense();
                        }}
                        _text={{
                          color: "#7F1D1D"
                        }}
                        style={{
                          backgroundColor: '#FCA5A5',
                          paddingHorizontal: 12,
                          paddingVertical: 10
                        }}
                      >
                        Save
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>

            {/* Add Income Popup */}
            <Center>
              <Button 
                onPress={() => setShowModalI(true)}
                _text={{
                  color: "#064E3B"
                }}
                style={{
                  backgroundColor: '#6EE7B7',
                  paddingHorizontal: 12,
                  paddingVertical: 10
                }}
              >
                Add Income
              </Button>
              <Modal isOpen={showModalI} onClose={() => setShowModalI(false)}>
                <Modal.Content maxWidth="400px">
                  <Modal.CloseButton />
                  <Modal.Header>Add Income</Modal.Header>
                  <Modal.Body>
                    <FormControl>
                      <FormControl.Label>Name</FormControl.Label>
                      <Input
                        type='text' 
                        value={incomeValue.name} 
                        onChangeText={val => setIncomeValue({ ...incomeValue, name: val })}/>
                    </FormControl>
                    <FormControl mt="3">
                      <FormControl.Label>Amount</FormControl.Label>
                      <Input 
                        type='text' 
                        value={incomeValue.amount.toString()}
                        onKeyPress={(event: any) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChangeText={val => setIncomeAmount(parseInt(val))}/>
                    </FormControl>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button.Group space={2}>
                      <Button
                        onPress={() =>
                        {
                          setShowModalI(false);
                        }}
                        _text={{
                          color: "#141414"
                        }}
                        style={{
                          borderColor: '#000000',
                          borderWidth: 1,
                          backgroundColor: 'rgb(0,0,0,0)',
                          paddingHorizontal: 12,
                          paddingVertical: 10
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onPress={() => 
                        {
                          setShowModalI(false);
                          addIncome();
                        }}
                        _text={{
                          color: "#064E3B"
                        }}
                        style={{
                          backgroundColor: '#6EE7B7',
                          paddingHorizontal: 12,
                          paddingVertical: 10
                        }}
                      >
                        Save
                      </Button>
                    </Button.Group>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </Center>
            
          </View>

          {/* Divider */}
          <View style={{marginHorizontal: 12}}>
            <Divider color={'#141414'}/>
          </View>

          {/* Weekly Stats */}
          <View 
            style={{
              marginHorizontal: 24,     
            }}
          >
            <Text fontSize="xl" bold>Your Weekly Expenses</Text>
            <Text fontSize="2xs">{getWeekRange()}</Text>
            <Text fontSize="2xl" bold>{formatRupiah(weeklyBalance)}</Text>
          </View>

          {/* Divider */}
          <View style={{marginHorizontal: 12}}>
            <Divider color={'#141414'}/>
          </View>

          <View style={{flex: 1}}>
            <Text fontSize="xl" bold
              style={{
                marginHorizontal: 24,
              }}>
              Weekly Transaction
            </Text>
            
            <View style={{ flex: 1, width: '100%'}}>
              {transactions.map((transaction: transaction) =>
              {
                return (
                  <Card transactionProps={transaction}/>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
}