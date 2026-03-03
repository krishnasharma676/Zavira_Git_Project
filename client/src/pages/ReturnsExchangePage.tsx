import ReturnsForm from '../components/returns/ReturnsForm';
import ReturnsGuidelines from '../components/returns/ReturnsGuidelines';

const ReturnsExchangePage = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-[#0D0D0D] pt-[80px] md:pt-[120px] pb-12 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <ReturnsForm />
          <ReturnsGuidelines />
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchangePage;
