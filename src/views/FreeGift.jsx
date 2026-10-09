import React, { useEffect } from "react";

const FreeGift = () => {
  useEffect(() => { document.title = "Get Free Bonus | Mahakal Matka"; }, []);
  return (
    <iframe
      title="Get Free Bonus"
      className="block h-full min-h-[calc(100dvh-56px)] w-full border-0"
      src="https://api.mahakalmatka.com/free-gift"
    />
  );
};

export default FreeGift;
