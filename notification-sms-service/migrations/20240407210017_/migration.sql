-- CreateTable
CREATE TABLE "code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expiredate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_pkey" PRIMARY KEY ("id")
);
