
import { Button } from "@/components/ui/button";

interface CommunitySectionProps {
  handleFindStudents: () => void;
}

export const CommunitySection = ({ handleFindStudents }: CommunitySectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl shadow-sm">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523580846011-d3a5bc25702b')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-600/80"></div>
          
          <div className="relative px-6 py-16 sm:px-12 lg:px-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ErasMatch is free, private, and growing fast.
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              ErasMatch is a safe space to meet, plan, and connect with real students before and during Erasmus.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">University of Barcelona</div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">Humboldt University</div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">Sorbonne University</div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">University of Amsterdam</div>
              <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm text-white text-sm">+ 45 more</div>
            </div>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleFindStudents}
            >
              Find Students Near You
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
