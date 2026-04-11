"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const BASE_ASSET_URL = "https://storage.googleapis.com/michaljuhas-public";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FlexibleDeliverySection() {
  return (
    <section className="py-12 md:py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 text-center"
        >
          <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">
            Flexible Delivery
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Available Online and In-Person
          </h2>
        </motion.div>

        <div className="relative">
          {/* Centre overlay card — desktop only */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full md:w-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            >
              <div className="bg-[#18181b] text-white px-14 py-10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/10 inline-block max-w-[600px] transform hover:scale-105 transition-transform duration-500 cursor-default">
                <h3 className="font-bold text-5xl leading-[1.2] tracking-tight text-center">
                  Delivering workshops <br /> online and in-person
                </h3>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            {/* Online card */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE }}
              className="group relative h-[450px] md:h-[800px] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image
                src={`${BASE_ASSET_URL}/img/Training-online.jpg`}
                alt="Online private workshop session"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-8 md:p-16 text-left">
                <div className="transform transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                  <span className="inline-block px-5 py-2 bg-purple-600/40 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-extrabold tracking-[0.2em] uppercase rounded-full w-fit mb-4 md:mb-6">
                    REMOTE
                  </span>
                  <h3 className="text-white font-extrabold text-3xl md:text-7xl tracking-tight leading-tight">
                    Online <br /> Workshop
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* In-person card */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: EASE }}
              className="group relative h-[450px] md:h-[800px] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <Image
                src={`${BASE_ASSET_URL}/img/Training-in-person.jpg`}
                alt="In-person private workshop session"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-8 md:p-16 text-left">
                <div className="transform transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                  <span className="inline-block px-5 py-2 bg-indigo-600/40 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-extrabold tracking-[0.2em] uppercase rounded-full w-fit mb-4 md:mb-6">
                    IN-PERSON
                  </span>
                  <h3 className="text-white font-extrabold text-3xl md:text-7xl tracking-tight leading-tight">
                    On-Site <br /> Workshop
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
