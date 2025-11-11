import { Badge } from '@/components/ui/badge';
import { Quote, Star } from 'lucide-react';
import { useDemoData } from '../../contexts/DataManagementContext';
import DemoFeedbackWidget from '../DemoFeedbackWidget';

const demoTestimonials = [
  {
    quote: "NILBx helped me turn my athletic achievements into real opportunities. The platform made it easy to connect with sponsors who believe in my vision.",
    author: "Sarah Williams",
    role: "Division I Volleyball Player",
    avatar: "/avatars/sarah.jpg",
    isDemo: true
  },
  {
    quote: "As a sponsor, I love being able to discover talented athletes and support them directly. The transparency and ease of use is unmatched.",
    author: "Marcus Chen",
    role: "Sports Equipment Brand Manager",
    avatar: "/avatars/marcus.jpg",
    isDemo: true
  },
  {
    quote: "Finally, a platform that lets fans truly support their favorite athletes. The exclusive content and experiences are incredible.",
    author: "Emma Rodriguez",
    role: "Super Fan & Collector",
    avatar: "/avatars/emma.jpg",
    isDemo: true
  }
];

const realTestimonials = [
  // Real testimonials would be loaded from API
];

const Testimonials = () => {
  const { data, isDemo, isTransitioning, progress } = useDemoData('testimonials', demoTestimonials, realTestimonials);

  return (
    <section className="py-32 bg-gradient-to-br from-slate-900/30 to-blue-900/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Join thousands of athletes, sponsors, and fans who are already part of the NIL revolution.
          </p>
          {isTransitioning && (
            <div className="mt-4">
              <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full">
                <p className="text-blue-300 text-sm">
                  🔄 Loading real testimonials... {progress}%
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {data.map((testimonial, index) => (
            <div
              key={index}
              className="glass-light rounded-2xl p-8 lg:p-10 relative overflow-hidden group border border-white/20"
            >
              {/* Quote Icon */}
              <Quote className="w-12 h-12 text-blue-500/20 absolute -top-6 -right-6" />

              <div className="space-y-6">
                <div className="text-blue-100 leading-relaxed">
                  "{testimonial.quote}"
                </div>

                <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-white">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* 5-Star Rating */}
              <div className="flex items-center justify-center mt-6 pt-6 border-t border-white/10">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm font-semibold text-yellow-400">5.0</span>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Data Disclaimer */}
        <div className="mt-16 text-center space-y-4">
          {isDemo ? (
            <div className="inline-block px-6 py-3 bg-blue-500/10 rounded-full border border-blue-400/30">
              <p className="text-blue-300 text-sm font-medium">
                💡 Demo testimonials shown • Real user stories coming soon
              </p>
            </div>
          ) : (
            <div className="inline-block px-6 py-3 bg-green-500/10 rounded-full border border-green-400/30">
              <p className="text-green-300 text-sm font-medium">
                ✅ Real testimonials from our community
              </p>
            </div>
          )}

          {/* Feedback Widget */}
          <DemoFeedbackWidget
            dataType="testimonials"
            className="mt-4"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;