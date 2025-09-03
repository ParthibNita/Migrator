import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/AuthStore.jsx';

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0,
    rotateZ: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: {
      type: 'spring',
      damping: 16,
      stiffness: 50,
      mass: 1,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotateY: 5,
    transition: {
      type: 'spring',
      damping: 7,
      stiffness: 210,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const DashboardPage = () => {
  const { playlists, loading } = useAuthStore();

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Your Playlists
        </motion.h1>
        <motion.p
          className="text-lg text-neutral-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Ready to transfer your music journey
        </motion.p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key="playlists-grid"
      >
        {playlists.map((list, index) => (
          <motion.div
            key={list.id}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
            custom={index}
            initial="hidden"
            animate="visible"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <Link to={`/playlists/${list.id}`}>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white overflow-hidden cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 group relative p-0">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.1,
                    ease: 'easeInOut',
                  }}
                />

                <CardHeader className="p-0 relative">
                  {list.images.length > 0 ? (
                    <>
                      <motion.img
                        src={list.images[0].url}
                        alt={`${list.name} cover`}
                        width={300}
                        height={300}
                        className="object-cover w-full h-auto aspect-square group-hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, scale: 1.15 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1 + 0.3,
                          ease: 'easeOut',
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-black/0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                      >
                        <motion.div
                          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      className="w-full aspect-square bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <svg
                        className="w-12 h-12 text-white opacity-50"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                      </svg>
                    </motion.div>
                  )}
                </CardHeader>

                <CardContent className="p-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1 + 0.5,
                      ease: 'easeOut',
                    }}
                  >
                    <CardTitle className="text-md font-semibold truncate group-hover:text-green-300 transition-colors duration-300">
                      {list.name}
                    </CardTitle>
                    <p className="text-xs text-white/60 mt-1 truncate">
                      {list.tracks?.total || 0} tracks
                    </p>
                  </motion.div>
                </CardContent>

                <motion.div
                  className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-0"
                  initial={{ opacity: 1, scale: 1.1 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {!loading && playlists.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-4 opacity-50"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              className="w-full h-full text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
            </svg>
          </motion.div>
          <p className="text-green-200 text-lg">No playlists found</p>
          <p className="text-green-100/60 text-sm mt-2">
            Connect your Spotify account to see your playlists
          </p>
        </motion.div>
      )}
    </div>
  );
};
