// components/Card.tsx

import React from 'react';
import Link from 'next/link';

const Header = ({subtitle}) => {
  return (
    <div className="bg-amber-400 backdrop-blur-md p-4 shadow-lg w-hull">
        <div className="font-bold text-lg">
            <Link href="/">
                Computer Graphics
            </Link>
        </div>
        <div>
        {subtitle}
        </div>
    </div>
  );
};

export default Header;
