// UI
import { Box, Text } from 'native-base';

// TYPES
import { transaction } from "../../types/type";

// FORMAT
import { formatDate } from "../dateFormat";
import { formatRupiah } from "../currencyFormat";

export default function Card({ transactionProps }:{ transactionProps: transaction}) 
{
  return (
    <Box style={{
      backgroundColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: {width: 4, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 4,
      borderRadius: 8,
      padding: 12,
      width: 'auto',
      marginBottom: 12,
      marginHorizontal: 24,
      flexDirection: 'column',
      // justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    }}>
      <Box
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          marginHorizontal: 0,
        }}  
      >
        <Text fontSize="xl" bold>{transactionProps.name}</Text>
        {
          transactionProps.type === 'INCOME' ? 
            <Text 
              style={{
                backgroundColor: '#6EE7B7',
                color: '#064E3B',
                width: 87,
                textAlign: "center",
                textAlignVertical: 'center',
                borderRadius: 2,
              }}
            >
            INCOME
            </Text> 
          :
            <Text 
              style={{
                backgroundColor: '#FCA5A5',
                color: '#7F1D1D',
                width: 87,
                textAlign: "center",
                textAlignVertical: 'center',
                borderRadius: 2,
              }}
            >
              EXPENSE
            </Text>
        }
      </Box>
      <Box
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
          marginHorizontal: 0,
        }}  
      >
        <Text fontSize="sm">{ transactionProps.date !== undefined ? formatDate(new Date(transactionProps.date)) : 'undefined' }</Text>
        <Text fontSize="md" bold>{transactionProps.amount > 0 ? formatRupiah(transactionProps.amount) : formatRupiah(-(transactionProps.amount))}</Text>
      </Box>
    </Box>
  )
}
