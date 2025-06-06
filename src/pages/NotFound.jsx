import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <ApperIcon name="Dumbbell" size={80} className="mx-auto text-primary mb-4" />
          <h1 className="text-4xl font-heading font-bold text-surface-900 dark:text-white mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-surface-600 dark:text-surface-300 text-lg">
            Looks like this page skipped leg day and disappeared!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-medium rounded-xl hover:shadow-lg transition-all"
        >
          <ApperIcon name="Home" size={20} className="mr-2" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound