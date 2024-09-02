// loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="text-white text-6xl animate-spin">
        🖌
      </div>
    </div>
  );
}
