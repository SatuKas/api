-- CreateTable
CREATE TABLE "feature" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateFeature" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "config" JSONB,

    CONSTRAINT "TemplateFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feature_code_key" ON "feature"("code");

-- CreateIndex
CREATE UNIQUE INDEX "template_code_key" ON "template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateFeature_templateId_featureId_key" ON "TemplateFeature"("templateId", "featureId");

-- AddForeignKey
ALTER TABLE "TemplateFeature" ADD CONSTRAINT "TemplateFeature_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateFeature" ADD CONSTRAINT "TemplateFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
