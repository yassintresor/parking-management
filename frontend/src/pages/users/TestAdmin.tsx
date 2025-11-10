import { useEffect } from "react";

const TestAdmin = () => {
  useEffect(() => {
    console.log("TestAdmin component mounted");
  }, []);
  
  return (
    <div className="min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold">Test Admin Page</h1>
      <p>This is a test page to verify routing works.</p>
    </div>
  );
};

export default TestAdmin;