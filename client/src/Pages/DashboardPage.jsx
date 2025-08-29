import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/AuthStore.jsx';

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
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
  const { playlists } = useAuthStore();
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <motion.h1
        className="text-3xl font-bold mb-6 text-green-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        Your Playlists
      </motion.h1>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {playlists.map((list) => (
          <motion.div
            key={list.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <Link to={`/playlists/${list.id}`} key={list.id}>
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 text-white overflow-hidden cursor-pointer hover:bg-neutral-800 transition-colors p-0">
                <CardHeader className="p-0">
                  {list.images.length > 0 && (
                    <img
                      src={list.images[0].url}
                      alt={`${list.name} cover`}
                      width={300}
                      height={300}
                      className="object-cover w-full h-auto aspect-square"
                    />
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-md font-semibold truncate">
                    {list.name}
                  </CardTitle>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
