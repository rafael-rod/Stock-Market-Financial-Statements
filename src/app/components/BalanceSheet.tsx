// import { useState, useEffect, useRef } from 'react';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Card, CardHeader, CardTitle } from '@/components/ui/card';
// import { useSpring, animated as a } from '@react-spring/web';

// interface BalanceSheetProps {
//   ticker: string;
// }

// interface BalanceSheetData {
//   date: string;
//   totalAssets: number;
//   totalLiabilities: number;
//   totalEquity: number;
// }

// interface Balance {
//   'Current Assets': string;
//   'Current Liabilities': string;
//   'Common Stock Equity': string;
// }

// interface JsonData {
//   balanceSheet: Record<string, Balance>;
// }

// const COLORS = ['#8B5CF6', '#10B981', '#F59E0B'];

// // Create a type-safe animated div component
// const AnimatedDiv = a('div');

// export default function BalanceSheet({ ticker }: BalanceSheetProps) {
//   const [data, setData] = useState<BalanceSheetData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState<string>('2024');
//   const [key, setKey] = useState(0);
//   const [showPieChart, setShowPieChart] = useState(false);
//   const [isDelayed, setIsDelayed] = useState(false);
//   const componentRef = useRef<HTMLDivElement | null>(null);

//   const rectAnimation = useSpring({
//     from: { opacity: 0, transform: 'translateY(20px)' },
//     to: { opacity: isDelayed ? 1 : 0, transform: isDelayed ? 'translateY(0px)' : 'translateY(20px)' },
//     config: { tension: 200, friction: 20 },
//   });

//   useEffect(() => {
//     const delayTimeout = setTimeout(() => {
//       setIsDelayed(true);
//     }, 300);

//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`http://localhost:5000/api/financials/${ticker}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         } else {
//           setLoading(false);
//         }

//         const responseText = await response.text();
//         const cleanedText = responseText.replace(/NaN/g, 'null');
//         const jsonData:JsonData = JSON.parse(cleanedText);

//         const balanceSheetData = Object.entries(jsonData.balanceSheet)
//           .map(([date, balance]: [string, Balance]) => ({
//             date,
//             totalAssets:Number( balance['Current Assets']) || 0,
//             totalLiabilities:Number (balance['Current Liabilities']) || 0,
//             totalEquity: Number (balance['Common Stock Equity']) || 0,
//           }))
//           .sort((a, b) => parseInt(b.date) - parseInt(a.date));

//         setData(balanceSheetData);
//       } catch {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (ticker) {
//       fetchData();
//     }

//     return () => clearTimeout(delayTimeout);
//   }, [ticker]);

//   useEffect(() => {
//     if (data.length > 0) {
//       const timer = setTimeout(() => {
//         setShowPieChart(true);
//       }, 0);

//       return () => clearTimeout(timer);
//     }
//   }, [data]);

//   const handleRowClick = (date: string) => {
//     setSelectedDate(date);
//     setKey((prev) => prev + 1);
//   };

//   if (!isDelayed) {
//     return <div className="text-center text-gray-400">Loading...</div>;
//   }

//   if (loading) return <div className="text-center text-gray-400">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;
//   if (data.length === 0) return <div className="text-center text-gray-400">No data available</div>;

//   const latestData = data.find((item) => item.date === selectedDate) || data[0];

//   const pieChartData = [
//     { name: 'Total Assets', value: latestData?.totalAssets || 0 },
//     { name: 'Total Liabilities', value: latestData?.totalLiabilities || 0 },
//     { name: 'Total Equity', value: latestData?.totalEquity || 0 },
//   ];

//   const formatTooltip = (value: number) => `$${(value / 1e9).toFixed(2)}B`;

//   const getYearFromDate = (date: string) => {
//     return new Date(date).getFullYear();
//   };

//   const filteredData = data.filter(
//     (item) => item.totalAssets !== 0 || item.totalLiabilities !== 0 || item.totalEquity !== 0
//   );

//   return (
//     <div ref={componentRef} className="space-y-8">
//       <h3 className="text-3xl font-semibold mb-4 text-gray-100">
//         Balance Sheet for {ticker} ({getYearFromDate(latestData?.date || '2024')})
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Total Assets</h4>
//           <p className="text-3xl font-bold text-purple-500">{formatTooltip(latestData?.totalAssets || 0)}</p>
//         </AnimatedDiv>
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Total Liabilities</h4>
//           <p className="text-3xl font-bold text-red-500">{formatTooltip(latestData?.totalLiabilities || 0)}</p>
//         </AnimatedDiv>
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Total Equity</h4>
//           <p className="text-3xl font-bold text-green-500">{formatTooltip(latestData?.totalEquity || 0)}</p>
//         </AnimatedDiv>
//       </div>

//       <div className="h-96 bg-black p-4 rounded-lg shadow-lg">
//         {showPieChart && (
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 key={key}
//                 data={pieChartData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={120}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 isAnimationActive={true}
//                 animationBegin={0}
//                 animationDuration={1000}
//                 animationEasing="ease-in-out"
//               >
//                 {pieChartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
//                 itemStyle={{ color: '#E5E7EB' }}
//                 labelStyle={{ color: '#9CA3AF' }}
//                 formatter={formatTooltip}
//               />
//               <Legend wrapperStyle={{ color: '#E5E7EB' }} />
//             </PieChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       <Card className="bg-black border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-100">Balance Sheet Details</CardTitle>
//           <CardTitle className="text-sm font-semibold text-gray-100">Click on a row to display data upside</CardTitle>
//         </CardHeader>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="text-gray-400">Year</TableHead>
//               <TableHead className="text-gray-400">Total Assets</TableHead>
//               <TableHead className="text-gray-400">Total Liabilities</TableHead>
//               <TableHead className="text-gray-400">Total Equity</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.map((item) => (
//               <TableRow
//                 key={item.date}
//                 className="cursor-pointer hover:bg-gray-700 transition duration-200"
//                 onClick={() => handleRowClick(item.date)}
//               >
//                 <TableCell className="text-gray-300">{new Date(item.date).getFullYear()}</TableCell>
//                 <TableCell className="text-gray-300">{formatTooltip(item.totalAssets)}</TableCell>
//                 <TableCell className="text-gray-300">{formatTooltip(item.totalLiabilities)}</TableCell>
//                 <TableCell className="text-gray-300">{formatTooltip(item.totalEquity)}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Card>
//     </div>
//   );
// }


import { useState, useEffect} from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface BalanceSheetProps {
  ticker: string;
}

interface BalanceSheetData {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

interface Balance {
  'Current Assets': string;
  'Current Liabilities': string;
  'Common Stock Equity': string;
}

interface JsonData {
  balanceSheet: Record<string, Balance>;
}

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B'];

export default function BalanceSheet({ ticker }: BalanceSheetProps) {
  const [data, setData] = useState<BalanceSheetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2024');
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://stock-market-financial-statements-gareqa73p.vercel.app/${ticker}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        } else {
          setLoading(false);
        }

        const responseText = await response.text();
        const cleanedText = responseText.replace(/NaN/g, 'null');
        const jsonData: JsonData = JSON.parse(cleanedText);

        const balanceSheetData = Object.entries(jsonData.balanceSheet)
          .map(([date, balance]: [string, Balance]) => ({
            date,
            totalAssets: Number(balance['Current Assets']) || 0,
            totalLiabilities: Number(balance['Current Liabilities']) || 0,
            totalEquity: Number(balance['Common Stock Equity']) || 0,
          }))
          .sort((a, b) => parseInt(b.date) - parseInt(a.date));

        setData(balanceSheetData);
      } catch {
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  const handleRowClick = (date: string) => {
    setSelectedDate(date);
    setKey((prev) => prev + 1);
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center text-gray-400">No data available</div>;

  const latestData = data.find((item) => item.date === selectedDate) || data[0];

  const pieChartData = [
    { name: 'Total Assets', value: latestData?.totalAssets || 0 },
    { name: 'Total Liabilities', value: latestData?.totalLiabilities || 0 },
    { name: 'Total Equity', value: latestData?.totalEquity || 0 },
  ];

  const formatTooltip = (value: number) => `$${(value / 1e9).toFixed(2)}B`;

  const getYearFromDate = (date: string) => {
    return new Date(date).getFullYear();
  };

  const filteredData = data.filter(
    (item) => item.totalAssets !== 0 || item.totalLiabilities !== 0 || item.totalEquity !== 0
  );

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-semibold mb-4 text-gray-100">
        Balance Sheet for {ticker} ({getYearFromDate(latestData?.date || '2024')})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Total Assets</h4>
          <p className="text-3xl font-bold text-purple-500">{formatTooltip(latestData?.totalAssets || 0)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Total Liabilities</h4>
          <p className="text-3xl font-bold text-red-500">{formatTooltip(latestData?.totalLiabilities || 0)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Total Equity</h4>
          <p className="text-3xl font-bold text-green-500">{formatTooltip(latestData?.totalEquity || 0)}</p>
        </div>
      </div>

      <div className="h-96 bg-black p-4 rounded-lg shadow-lg">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                key={key}
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
                itemStyle={{ color: '#E5E7EB' }}
                labelStyle={{ color: '#9CA3AF' }}
                formatter={formatTooltip}
              />
              <Legend wrapperStyle={{ color: '#E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
      </div>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">Balance Sheet Details</CardTitle>
          <CardTitle className="text-sm font-semibold text-gray-100">Click on a row to display data upside</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Year</TableHead>
              <TableHead className="text-gray-400">Total Assets</TableHead>
              <TableHead className="text-gray-400">Total Liabilities</TableHead>
              <TableHead className="text-gray-400">Total Equity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.date}
                className="cursor-pointer hover:bg-gray-700 transition duration-200"
                onClick={() => handleRowClick(item.date)}
              >
                <TableCell className="text-gray-300">{new Date(item.date).getFullYear()}</TableCell>
                <TableCell className="text-gray-300">{formatTooltip(item.totalAssets)}</TableCell>
                <TableCell className="text-gray-300">{formatTooltip(item.totalLiabilities)}</TableCell>
                <TableCell className="text-gray-300">{formatTooltip(item.totalEquity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
