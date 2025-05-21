import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full bg-gray-100">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-24 gap-10">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-4xl md:text-5xl font-bold">
            <span className="text-red-400">Experience</span> the Best
          </p>
          <div className="mt-4 flex flex-col md:flex-row items-center md:items-start md:space-x-3">
            <div className="w-24 h-1.5 bg-red-400 md:mt-4"></div>
            <div className="text-3xl md:text-4xl font-bold mt-2 md:mt-0">
              Beauty Services
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-base md:text-lg text-justify leading-relaxed">
            We offer a wide range of professional beauty, skincare, and makeup
            services designed to enhance your natural glow and boost your
            confidence. Whether it’s your wedding day or a special event, our
            expert artists are here to make every moment beautiful.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src="/hero-img.png"
            alt="Makeup Artist at Work"
            width={500}
            height={500}
            className="object-contain max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
