// import { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useSpring, animated as a } from '@react-spring/web';

// interface IncomeStatementProps {
//   ticker: string;
// }
// interface Income{
//   'Total Revenue': number;
//   'Gross Profit': number;
//   'Operating Income': number;
//   'Net Income': number;
// }
// interface JsonData{
//   incomeStatement: Record<string, Income>;
// }

// interface IncomeData {
//   date: string;
//   revenue: number;
//   grossProfit: number;
//   operatingIncome: number;
//   netIncome: number;
// }

// // Create a type-safe animated div component
// const AnimatedDiv = a('div');

// export default function IncomeStatement({ ticker }: IncomeStatementProps) {
//   const [data, setData] = useState<IncomeData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isDelayed, setIsDelayed] = useState(false);
//   const [showCharts, setShowCharts] = useState(false);

//   const rectAnimation = useSpring({
//     from: { opacity: 0, transform: 'translateY(20px)' },
//     to: { opacity: isDelayed ? 1 : 0, transform: isDelayed ? 'translateY(0px)' : 'translateY(20px)' },
//     config: { tension: 200, friction: 20 },
//   });

//   useEffect(() => {
//     const delayTimeout = setTimeout(() => {
//       setIsDelayed(true);
//     }, 300);

//     async function fetchData() {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`http://localhost:5000/api/financials/${ticker}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const responseText = await response.text();
//         const cleanedText = responseText.replace(/NaN/g, 'null');
//         const jsonData:JsonData = JSON.parse(cleanedText);

//         const incomeData = Object.entries(jsonData.incomeStatement)
//           .map(([date, values]: [string, Income]) => ({
//             date,
//             revenue: values['Total Revenue'] || 0,
//             grossProfit: values['Gross Profit'] || 0,
//             operatingIncome: values['Operating Income'] || 0,
//             netIncome: values['Net Income'] || 0,
//           }))
//           .sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear())
//           .filter(
//             (item) =>
//               item.revenue > 0 ||
//               item.grossProfit > 0 ||
//               item.operatingIncome > 0 ||
//               item.netIncome > 0
//           );

//         setData(incomeData);
//       } catch {
//         setError('Error fetching data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (ticker) {
//       fetchData();
//     }

//     return () => clearTimeout(delayTimeout);
//   }, [ticker]);

//   useEffect(() => {
//     if (data.length > 0 && isDelayed) {
//       const timer = setTimeout(() => {
//         setShowCharts(true);
//       }, 0);

//       return () => clearTimeout(timer);
//     }
//   }, [data, isDelayed]);

//   if (!isDelayed) {
//     return <div className="text-center text-gray-400">Loading...</div>;
//   }

//   if (loading) return <div className="text-center text-gray-400">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;
//   if (data.length === 0) return <div className="text-center text-gray-400">No data available</div>;

//   const latestData = data[data.length - 1];
//   const filteredData = data.filter(
//     (item) =>
//       item.revenue !== 0 &&
//       item.grossProfit !== 0 &&
//       item.operatingIncome !== 0 &&
//       item.netIncome !== 0
//   );

//   const formatYAxis = (value: number) => `$${(value / 1e9).toFixed(0)}B`;
//   const formatTooltip = (value: number) => `$${(value / 1e9).toFixed(2)}B`;

//   const formatXAxis = (date: string) => {
//     return new Date(date).getFullYear().toString();
//   };

//   return (
//     <div className="space-y-8">
//       <h3 className="text-3xl font-semibold mb-4 text-gray-100">
//         Income Statement for {ticker}
//       </h3>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Revenue</h4>
//           <p className="text-3xl font-bold text-green-400">{formatTooltip(latestData.revenue)}</p>
//         </AnimatedDiv>
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Net Income</h4>
//           <p className="text-3xl font-bold text-blue-400">{formatTooltip(latestData.netIncome)}</p>
//         </AnimatedDiv>
//         <AnimatedDiv style={rectAnimation} className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
//           <h4 className="text-lg font-medium mb-2 text-gray-300">Gross Margin</h4>
//           <p className="text-3xl font-bold text-purple-400">
//             {((latestData.grossProfit / latestData.revenue) * 100).toFixed(2)}%
//           </p>
//         </AnimatedDiv>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <Card className="bg-black border-gray-700">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold text-gray-100">Revenue Trend</CardTitle>
//             <CardDescription className="text-gray-400">Annual revenue over time</CardDescription>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="h-80">
//               {showCharts && (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                     <XAxis
//                       dataKey="date"
//                       stroke="#9CA3AF"
//                       tickFormatter={formatXAxis}
//                     />
//                     <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} domain={[0, 'dataMax + 1000000000']} />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
//                       itemStyle={{ color: '#E5E7EB' }}
//                       labelStyle={{ color: '#9CA3AF' }}
//                       formatter={formatTooltip}
//                     />
//                     <Legend wrapperStyle={{ color: '#E5E7EB' }} />
//                     <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-black border-gray-700">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold text-gray-100">Net Income Trend</CardTitle>
//             <CardDescription className="text-gray-400">Annual net income over time</CardDescription>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="h-80">
//               {showCharts && (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                     <XAxis
//                       dataKey="date"
//                       stroke="#9CA3AF"
//                       tickFormatter={formatXAxis}
//                     />
//                     <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} domain={[0, 'dataMax + 1000000000']} />
//                     <Tooltip
//                       contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
//                       itemStyle={{ color: '#E5E7EB' }}
//                       labelStyle={{ color: '#9CA3AF' }}
//                       formatter={formatTooltip}
//                     />
//                     <Legend wrapperStyle={{ color: '#E5E7EB' }} />
//                     <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="bg-black border-gray-700">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-100">Income Statement Details</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="text-gray-300">Year</TableHead>
//                 <TableHead className="text-gray-300">Revenue</TableHead>
//                 <TableHead className="text-gray-300">Gross Profit</TableHead>
//                 <TableHead className="text-gray-300">Operating Income</TableHead>
//                 <TableHead className="text-gray-300">Net Income</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredData
//                 .slice()
//                 .sort((a, b) => new Date(b.date).getFullYear() - new Date(a.date).getFullYear())
//                 .map((item) => (
//                   <TableRow key={item.date}>
//                     <TableCell className="text-gray-300">{new Date(item.date).getFullYear()}</TableCell>
//                     <TableCell className="text-gray-300">{formatTooltip(item.revenue)}</TableCell>
//                     <TableCell className="text-gray-300">{formatTooltip(item.grossProfit)}</TableCell>
//                     <TableCell className="text-gray-300">{formatTooltip(item.operatingIncome)}</TableCell>
//                     <TableCell className="text-gray-300">{formatTooltip(item.netIncome)}</TableCell>
//                   </TableRow>
//                 ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface IncomeStatementProps {
  ticker: string;
}

interface Income {
  'Total Revenue': number;
  'Gross Profit': number;
  'Operating Income': number;
  'Net Income': number;
}

interface JsonData {
  incomeStatement: Record<string, Income>;
}

interface IncomeData {
  date: string;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
}

export default function IncomeStatement({ ticker }: IncomeStatementProps) {
  const [data, setData] = useState<IncomeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://stock-market-financial-statements-api.vercel.app/${ticker}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const responseText = await response.text();
        const cleanedText = responseText.replace(/NaN/g, 'null');
        const jsonData: JsonData = JSON.parse(cleanedText);

        const incomeData = Object.entries(jsonData.incomeStatement)
          .map(([date, values]: [string, Income]) => ({
            date,
            revenue: values['Total Revenue'] || 0,
            grossProfit: values['Gross Profit'] || 0,
            operatingIncome: values['Operating Income'] || 0,
            netIncome: values['Net Income'] || 0,
          }))
          .sort((a, b) => new Date(a.date).getFullYear() - new Date(b.date).getFullYear())
          .filter(
            (item) =>
              item.revenue > 0 ||
              item.grossProfit > 0 ||
              item.operatingIncome > 0 ||
              item.netIncome > 0
          );

        setData(incomeData);
      } catch {
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (ticker) {
      fetchData();
    }
  }, [ticker]);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center text-gray-400">No data available</div>;

  const latestData = data[data.length - 1];
  const filteredData = data.filter(
    (item) =>
      item.revenue !== 0 &&
      item.grossProfit !== 0 &&
      item.operatingIncome !== 0 &&
      item.netIncome !== 0
  );

  const formatYAxis = (value: number) => `$${(value / 1e9).toFixed(0)}B`;
  const formatTooltip = (value: number) => `$${(value / 1e9).toFixed(2)}B`;

  const formatXAxis = (date: string) => {
    return new Date(date).getFullYear().toString();
  };

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-semibold mb-4 text-gray-100">
        Income Statement for {ticker}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Revenue</h4>
          <p className="text-3xl font-bold text-green-400">{formatTooltip(latestData.revenue)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Net Income</h4>
          <p className="text-3xl font-bold text-blue-400">{formatTooltip(latestData.netIncome)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Gross Margin</h4>
          <p className="text-3xl font-bold text-purple-400">
            {((latestData.grossProfit / latestData.revenue) * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-100">Revenue Trend</CardTitle>
            <CardDescription className="text-gray-400">Annual revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatXAxis} />
                  <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} domain={[0, 'dataMax + 1000000000']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
                    itemStyle={{ color: '#E5E7EB' }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={formatTooltip}
                  />
                  <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-100">Net Income Trend</CardTitle>
            <CardDescription className="text-gray-400">Annual net income over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" tickFormatter={formatXAxis} />
                  <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} domain={[0, 'dataMax + 1000000000']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
                    itemStyle={{ color: '#E5E7EB' }}
                    labelStyle={{ color: '#9CA3AF' }}
                    formatter={formatTooltip}
                  />
                  <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                  <Line type="monotone" dataKey="netIncome" name="Net Income" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">Income Statement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-300">Year</TableHead>
                <TableHead className="text-gray-300">Revenue</TableHead>
                <TableHead className="text-gray-300">Gross Profit</TableHead>
                <TableHead className="text-gray-300">Operating Income</TableHead>
                <TableHead className="text-gray-300">Net Income</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData
                .slice()
                .sort((a, b) => new Date(b.date).getFullYear() - new Date(a.date).getFullYear())
                .map((item) => (
                  <TableRow key={item.date}>
                    <TableCell className="text-gray-300">{new Date(item.date).getFullYear()}</TableCell>
                    <TableCell className="text-gray-300">{formatTooltip(item.revenue)}</TableCell>
                    <TableCell className="text-gray-300">{formatTooltip(item.grossProfit)}</TableCell>
                    <TableCell className="text-gray-300">{formatTooltip(item.operatingIncome)}</TableCell>
                    <TableCell className="text-gray-300">{formatTooltip(item.netIncome)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
