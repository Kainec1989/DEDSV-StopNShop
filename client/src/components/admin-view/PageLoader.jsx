/* eslint-disable react/prop-types */
import Layout from "./Layout";

const variantConfig = {
  dashboard: {
    statCards: 3,
    formBlocks: 0,
    tableColumns: 0,
    tableRows: 0,
    showChart: true,
  },
  products: {
    statCards: 0,
    formBlocks: 6,
    tableColumns: 8,
    tableRows: 4,
    showChart: false,
  },
  table: {
    statCards: 0,
    formBlocks: 0,
    tableColumns: 6,
    tableRows: 5,
    showChart: false,
  },
  users: {
    statCards: 0,
    formBlocks: 4,
    tableColumns: 5,
    tableRows: 4,
    showChart: false,
  },
};

/**
 * Renders a consistent placeholder for admin pages while data is loading.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Page title displayed above the skeleton.
 * @param {"dashboard"|"products"|"table"|"users"} [props.variant] - Skeleton layout variant.
 * @returns {JSX.Element} Animated admin page skeleton.
 */
export const FullPageSkeleton = ({ title = "Admin page", variant = "table" }) => {
  const config = variantConfig[variant] || variantConfig.table;

  return (
    <section
      className="animate-pulse"
      aria-busy="true"
      aria-live="polite"
      aria-label={`${title} is loading`}
    >
      <div className="mb-6">
        <div className="h-8 w-48 rounded bg-gray-200" aria-hidden="true" />
        <span className="sr-only">{title} is loading...</span>
      </div>

      {config.statCards > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: config.statCards }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="mt-4 h-5 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {config.formBlocks > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {Array.from({ length: config.formBlocks }).map((_, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2 h-4 w-28 rounded bg-gray-200" />
              <div className="h-10 w-full rounded bg-gray-100" />
            </div>
          ))}
          <div className="h-10 w-28 rounded bg-gray-200" />
        </div>
      )}

      {config.tableColumns > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${config.tableColumns}, minmax(0, 1fr))` }}>
            {Array.from({ length: config.tableColumns }).map((_, index) => (
              <div key={`header-${index}`} className="h-4 rounded bg-gray-200" />
            ))}
            {Array.from({ length: config.tableRows * config.tableColumns }).map((_, index) => (
              <div key={`cell-${index}`} className="h-5 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      )}

      {config.showChart && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6 h-5 w-36 rounded bg-gray-200" />
          <div className="flex h-64 items-end gap-3">
            {[45, 70, 55, 85, 65, 90, 60].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-gray-100"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/**
 * Wraps the admin full-page skeleton with the shared admin layout.
 *
 * @param {object} props - Component props.
 * @param {string} props.title - Page title used for accessible loading text.
 * @param {"dashboard"|"products"|"table"|"users"} [props.variant] - Skeleton layout variant.
 * @returns {JSX.Element} Admin page loader.
 */
const PageLoader = ({ title = "Admin page", variant = "table" }) => (
  <Layout>
    <FullPageSkeleton title={title} variant={variant} />
  </Layout>
);

export default PageLoader;
