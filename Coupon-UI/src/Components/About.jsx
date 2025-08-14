import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const About = () => (
  <div className="flex justify-center items-center min-h-screen bg-white">
    <Card className="max-w-xl w-full shadow-lg">
      <CardHeader>
        <CardTitle>About Kup-ons</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">
          Kup-ons is a modern coupon management platform designed to help users discover, save, and redeem the best deals with ease. 
          Our mission is to make saving money simple and accessible for everyone.
        </p>
        <p className="mt-4 text-gray-600 text-sm">
          Built with React, Tailwind CSS, and shadcn/ui for a seamless and delightful user experience.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default About;