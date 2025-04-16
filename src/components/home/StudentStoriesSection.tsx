
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

export const StudentStoriesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Stories</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Real experiences from the ErasMatch community
          </p>
        </div>

        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            <CarouselItem className="md:basis-1/1 lg:basis-1/2">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 text-lg">
                    "I matched with 3 people before arriving in Amsterdam. We travelled together every weekend and became inseparable during our entire exchange."
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center text-blue-600 font-semibold">
                      JD
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Julia Dubois 🇫🇷</p>
                      <p className="text-sm text-gray-500">University of Amsterdam</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/1 lg:basis-1/2">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 text-lg">
                    "I was nervous about going to Prague alone, but I already had a roommate through ErasMatch before arriving. It made the whole experience so much easier!"
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center text-green-600 font-semibold">
                      MS
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Marco Sanchez 🇪🇸</p>
                      <p className="text-sm text-gray-500">Charles University Prague</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="md:basis-1/1 lg:basis-1/2">
              <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-6 text-lg">
                    "The city chat for Berlin was so active! I got amazing tips about housing and which courses to take. It really helped me prepare for my semester abroad."
                  </p>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center text-purple-600 font-semibold">
                      LK
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">Lena Kowalski 🇵🇱</p>
                      <p className="text-sm text-gray-500">Humboldt University Berlin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12" />
            <CarouselNext className="-right-12" />
          </div>
        </Carousel>
        
        <div className="md:hidden flex justify-center gap-2 mt-8">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};
