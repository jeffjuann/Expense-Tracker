import { View, SafeAreaView } from 'react-native';
import { Text, Button, Modal, Center, FormControl, Input, Divider, ScrollView } from 'native-base';
import { useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { transaction } from './../types/type';
import Card from '../components/ui/transCard';
import { formatDate } from '../components/ui/dateFormat';

export default function Dashboard() 
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
        tx.executeSql('INSERT INTO transactions (name, amount, type, date) values (?, ?, \'EXPENSE\', ?)', [expenseValue.name, expenseValue.amount, date.toISOString()],
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
        tx.executeSql('INSERT INTO transactions (name, amount, type, date) values (?, ?, \'INCOME\', ?)', [incomeValue.name, incomeValue.amount, date.toISOString()],
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
  
  function formatRupiah(value: number){
    var number_string = value.toString().replace(/[^,\d]/g, '').toString();
    var split = number_string.split(',');
    var sisa = split[0].length % 3;
    var rupiah = split[0].substr(0, sisa);
    var ribuan = split[0].substr(sisa).match(/\d{3}/gi);
  
    if(ribuan){
      var separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
  
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return 'Rp. ' + rupiah;
  }




  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: 'green'
      }}
    >
      {/* Header */}
      <View 
        style={{
          paddingHorizontal: 24,
          backgroundColor: 'cyan',
          paddingVertical: 48
        }}
      >
        <Text fontSize="xl" bold>Your Balance</Text>
        <Text fontSize="3xl" bold>{formatRupiah(50000)}</Text>
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
          <Text fontSize="2xl" bold>Rp. 15.000,00</Text>
        </View>

        {/* Divider */}
        <View style={{marginHorizontal: 12}}>
          <Divider color={'#141414'}/>
        </View>

        <View style={{flex: 1}}>
          <Text fontSize="xl" bold
            style={{
              paddingHorizontal:12, 
              paddingBottom: 12, 
              marginHorizontal: 12, 
              borderBottomColor: '#141414',
              borderBottomWidth: 1
            }}
          >
            Weekly Transaction
          </Text>
          
          <View style={{ flex: 1}}>
            <ScrollView style={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
              {transactions.map((transaction: transaction) =>
              {
                return (
                  <Card transactionProps={transaction}/>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}