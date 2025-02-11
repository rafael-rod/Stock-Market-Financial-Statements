import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface CashFlowProps {
  ticker: string;
}

interface JsonData {
  cashFlow: Record<string, CashFlow>;
}

interface CashFlow {
  'Operating Cash Flow': number;
  'Investing Cash Flow': number;
  'Financing Cash Flow': number;
  'Free Cash Flow': number;
}

interface CashFlowData {
  date: string;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
}

export default function CashFlow({ ticker }: CashFlowProps) {
  const [data, setData] = useState<CashFlowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://stock-market-financial-statements-api.vercel.app/${ticker}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const responseText = await response.text();
        const cleanedText = responseText.replace(/NaN/g, 'null');
        const jsonData: JsonData = JSON.parse(cleanedText);

        const cashFlowData = Object.entries(jsonData.cashFlow)
          .map(([date, values]: [string, CashFlow]) => ({
            date: date.substring(0, 4),
            operatingCashFlow: values['Operating Cash Flow'] || 0,
            investingCashFlow: values['Investing Cash Flow'] || 0,
            financingCashFlow: values['Financing Cash Flow'] || 0,
            netCashFlow: values['Free Cash Flow'] || 0,
          }))
          .sort((a, b) => parseInt(a.date) - parseInt(b.date))
          .filter(
            (item) =>
              item.operatingCashFlow !== 0 ||
              item.investingCashFlow !== 0 ||
              item.financingCashFlow !== 0 ||
              item.netCashFlow !== 0
          );
        setData(cashFlowData);
      } catch (err) {
        console.error(err);
        setError('Error fetching data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!loading && data.length === 0) return <div className="text-center text-gray-400">No data available</div>;

  const latestData = data[data.length - 1];

  const formatYAxis = (value: number) => `$${(value / 1e9).toFixed(0)}B`;
  const formatTooltip = (value: number) => `$${(value / 1e9).toFixed(2)}B`;

  return (
    <div className="space-y-8">
      <h3 className="text-3xl font-semibold mb-4 text-gray-100">
        Cash Flow Statement for {ticker}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Operating Cash Flow</h4>
          <p className="text-3xl font-bold text-blue-400">{formatTooltip(latestData.operatingCashFlow)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Investing Cash Flow</h4>
          <p className="text-3xl font-bold text-yellow-400">{formatTooltip(latestData.investingCashFlow)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
          <h4 className="text-lg font-medium mb-2 text-gray-300">Free Cash Flow</h4>
          <p className="text-3xl font-bold text-green-400">{formatTooltip(latestData.netCashFlow)}</p>
        </div>
      </div>

      <div className="h-80 bg-black p-4 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" tickFormatter={formatYAxis} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.375rem' }}
              itemStyle={{ color: '#E5E7EB' }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={formatTooltip}
            />
            <Legend wrapperStyle={{ color: '#E5E7EB' }} />
            <Line type="monotone" dataKey="operatingCashFlow" name="Operating" stroke="#3B82F6" />
            <Line type="monotone" dataKey="investingCashFlow" name="Investing" stroke="#F59E0B" />
            <Line type="monotone" dataKey="financingCashFlow" name="Financing" stroke="#10B981" />
            <Line type="monotone" dataKey="netCashFlow" name="Free Cash Flow" stroke="#EF4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">Cash Flow Details</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Year</TableHead>
              <TableHead className="text-gray-300">Operating Cash Flow</TableHead>
              <TableHead className="text-gray-300">Investing Cash Flow</TableHead>
              <TableHead className="text-gray-300">Financing Cash Flow</TableHead>
              <TableHead className="text-gray-300">Free Cash Flow</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .slice()
              .sort((a, b) => parseInt(b.date) - parseInt(a.date))
              .map((item) => (
                <TableRow key={item.date}>
                  <TableCell className="text-gray-300">{item.date}</TableCell>
                  <TableCell className="text-gray-300">{formatTooltip(item.operatingCashFlow)}</TableCell>
                  <TableCell className="text-gray-300">{formatTooltip(item.investingCashFlow)}</TableCell>
                  <TableCell className="text-gray-300">{formatTooltip(item.financingCashFlow)}</TableCell>
                  <TableCell className="text-gray-300">{formatTooltip(item.netCashFlow)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
