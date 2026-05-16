CREATE TABLE "wedding_photos" (
    "id" UUID NOT NULL,
    "file_key" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wedding_photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "guest_photos" (
    "id" UUID NOT NULL,
    "file_key" TEXT NOT NULL,
    "original_name" TEXT,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guest_photos_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wedding_photos_file_key_key" ON "wedding_photos"("file_key");
CREATE UNIQUE INDEX "guest_photos_file_key_key" ON "guest_photos"("file_key");
