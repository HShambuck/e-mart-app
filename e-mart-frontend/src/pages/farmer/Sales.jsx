import { useState, useEffect } from "react";
import { IoDownload } from "react-icons/io5";
import SalesAnalytics from "../../components/farmer/SalesAnalytics";
import EarningsCard from "../../components/farmer/EarningsCard";
import TransactionHistory from "../../components/farmer/TransactionHistory";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import farmerService from "../../api/services/farmerService";
import toast from "react-hot-toast";

const Sales = () => {
  const [earnings, setEarnings] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      const [earningsData, transactionsData] = await Promise.all([
        farmerService.getEarnings(),
        farmerService.getEarnings({ includeTransactions: true }),
      ]);
      setEarnings(earningsData.earnings);
      setTransactions(transactionsData.transactions || []);
    } catch (error) {
      toast.error("Failed to fetch sales data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();

      const blob = await farmerService.exportSalesReport(
        startDate.toISOString(),
        endDate.toISOString(),
      );

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sales-report-${new Date().toISOString().split("T")[0]}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
      console.error(error);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading sales data..." />;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-header">Sales & Earnings</h1>
          <p className="text-neutral-600">
            Track your sales performance and earnings
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<IoDownload />}
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </div>

      {/* Earnings Overview */}
      <div className="mb-8">
        <EarningsCard earnings={earnings} onExport={handleExportReport} />
      </div>

      {/* Sales Analytics */}
      <div className="mb-8">
        <SalesAnalytics />
      </div>

      {/* Transaction History */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          Transaction History
        </h2>
        <TransactionHistory transactions={transactions} />
      </Card>
    </div>
  );
};

export default Sales;
