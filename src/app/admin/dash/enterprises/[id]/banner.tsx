import { UploadImageInput } from 'components/upload-image-input';

export const Banner = ({
  banner,
  handleBanner,
}: {
  banner: File | string | null;
  handleBanner: (f: File | null) => void;
}) => (
  <div>
    <span className="text-xl uppercase block text-center">Atualizar</span>
    <h1 className="text-center">Banner Destaque</h1>

    <div className="max-w-2xl mx-auto mt-4 mb-8">
      <UploadImageInput
        file={banner}
        handleFile={(file) => handleBanner(file)}
        id="banner"
      />
    </div>
  </div>
);
