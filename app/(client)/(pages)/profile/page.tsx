import React from "react";

import prisma from "@/app/_lib/db";
import Profile from "@/app/(client)/(pages)/profile/profile";
import { serverAuth } from "@/app/_lib/serverAuth";

const ProfilePage = async () => {
  const session = await serverAuth();

  const userProfile = await prisma.userProfile.findFirst({
    where: {
      userId: session?.user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return <Profile initialData={userProfile} />;
};

export default ProfilePage;
