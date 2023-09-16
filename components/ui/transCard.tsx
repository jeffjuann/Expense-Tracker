import { View } from "react-native";
import { transaction } from "../../types/type";
import { Text } from 'native-base'; 
import { formatDate } from "./dateFormat";

export default function Card({ transactionProps }:{ transactionProps: transaction}) 
{
  return (
    <View style={{
      backgroundColor: '#FAF9F6',
      shadowColor: '#000000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 14,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      marginHorizontal: 24
    }}>
      <Text fontSize="xl" bold>{transactionProps.name}</Text>
      <Text fontSize="md" bold>{transactionProps.amount}</Text>
      <Text fontSize="sm">{formatDate(Date(transactionProps.date))}</Text>
      {transactionProps.type === 'INCOME' ? <Text>INCOME</Text> : <Text>EXPENSE</Text>}
    </View>
  )
}
