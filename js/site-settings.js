const SITE_OVERRIDES_KEY = 'drixSiteOverrides';
const defaultOverrides = {
  heroImage: 'images/hero.jpg',
  productImages: {
    1: 'images/product1.jpg',
    2: 'images/product2.jpg',
    3: 'images/product3.jpg',
    4: 'images/product4.jpg',
    5: 'images/product5.jpg',
    6: 'images/product6.jpg',
  },
};

const getSiteOverrides = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SITE_OVERRIDES_KEY));
    return {
      ...defaultOverrides,
      ...stored,
      productImages: {
        ...defaultOverrides.productImages,
        ...(stored?.productImages || {}),
      },
    };
  } catch (error) {
    return { ...defaultOverrides };
  }
};

const saveSiteOverrides = (overrides) => {
  localStorage.setItem(SITE_OVERRIDES_KEY, JSON.stringify(overrides));
};

const getProductImageOverride = (productId) => {
  const overrides = getSiteOverrides();
  if (overrides.productImages[productId]) {
    return overrides.productImages[productId];
  }
  return typeof getProductById === 'function' ? getProductById(productId)?.image || '' : '';
};

const applySiteImageOverrides = () => {
  const overrides = getSiteOverrides();

  const heroImage = document.getElementById('hero-image');
  if (heroImage && overrides.heroImage) {
    heroImage.src = overrides.heroImage;
  }

  document.querySelectorAll('[data-product-id]').forEach((img) => {
    const productId = Number(img.dataset.productId);
    if (!Number.isNaN(productId) && overrides.productImages[productId]) {
      img.src = overrides.productImages[productId];
    }
  });
};

const initDashboardImageManager = () => {
  const form = document.getElementById('image-settings-form');
  if (!form) return;

  const heroInput = document.getElementById('hero-image-input');
  const heroPreview = document.getElementById('hero-image-preview');
  const productInputs = [...document.querySelectorAll('[data-dashboard-product-id]')];

  const loadSettings = () => {
    const overrides = getSiteOverrides();
    heroInput.value = overrides.heroImage;
    heroPreview.src = overrides.heroImage;

    productInputs.forEach((input) => {
      const id = Number(input.dataset.dashboardProductId);
      input.value = overrides.productImages[id] || defaultOverrides.productImages[id];
      const preview = document.getElementById(`product-preview-${id}`);
      if (preview) {
        preview.src = input.value;
      }
    });
  };

  const updatePreviews = () => {
    heroPreview.src = heroInput.value || defaultOverrides.heroImage;
    productInputs.forEach((input) => {
      const id = Number(input.dataset.dashboardProductId);
      const preview = document.getElementById(`product-preview-${id}`);
      if (preview) {
        preview.src = input.value || defaultOverrides.productImages[id];
      }
    });
  };

  const gatherOverrides = () => {
    const overrides = {
      heroImage: heroInput.value.trim() || defaultOverrides.heroImage,
      productImages: {},
    };

    productInputs.forEach((input) => {
      const id = Number(input.dataset.dashboardProductId);
      overrides.productImages[id] = input.value.trim() || defaultOverrides.productImages[id];
    });

    return overrides;
  };

  const saveCurrentOverrides = () => {
    const overrides = gatherOverrides();
    saveSiteOverrides(overrides);
    applySiteImageOverrides();
    updatePreviews();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveCurrentOverrides();
    alert('تم حفظ إعدادات الصور. أعد تحميل الصفحة أو انتقل إلى الصفحة الأخرى لرؤية التغييرات.');
  });

  document.getElementById('reset-image-settings')?.addEventListener('click', () => {
    saveSiteOverrides(defaultOverrides);
    loadSettings();
    applySiteImageOverrides();
    alert('تم إعادة إعداد الصور إلى القيم الافتراضية.');
  });

  const filePicker = document.getElementById('dashboard-file-picker');
  let activeFileTarget = null;

  const getPreviewImage = (targetId) => document.getElementById(`${targetId.replace('image-input', 'image-preview')}`) || document.getElementById(`${targetId.replace('product-image', 'product-preview')}`);

  const clearImageInput = (targetId) => {
    const input = document.getElementById(targetId);
    if (!input) return;

    input.value = '';
    const preview = getPreviewImage(targetId);
    if (preview) {
      if (targetId === 'hero-image-input') {
        preview.src = defaultOverrides.heroImage;
      } else {
        const productId = Number(input.dataset.dashboardProductId);
        preview.src = defaultOverrides.productImages[productId];
      }
    }

    saveCurrentOverrides();
  };

  const setImageInputValue = (targetId, value) => {
    const input = document.getElementById(targetId);
    if (!input) return;
    input.value = value;
    const preview = getPreviewImage(targetId);
    if (preview) {
      preview.src = value || (targetId === 'hero-image-input' ? defaultOverrides.heroImage : defaultOverrides.productImages[Number(input.dataset.dashboardProductId)]);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeFileTarget) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageInputValue(activeFileTarget, reader.result);
      saveCurrentOverrides();
      activeFileTarget = null;
      filePicker.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleImageControlClick = (event) => {
    const uploadButton = event.target.closest('.image-upload-button');
    const clearButton = event.target.closest('.image-clear-button');

    if (uploadButton) {
      activeFileTarget = uploadButton.dataset.imageTarget;
      filePicker?.click();
    }

    if (clearButton) {
      clearImageInput(clearButton.dataset.imageTarget);
    }
  };

  filePicker?.addEventListener('change', handleFileSelect);
  document.getElementById('image-settings-form')?.addEventListener('click', handleImageControlClick);
  heroInput.addEventListener('input', updatePreviews);
  productInputs.forEach((input) => input.addEventListener('input', updatePreviews));

  loadSettings();
};

document.addEventListener('DOMContentLoaded', () => {
  applySiteImageOverrides();
  initDashboardImageManager();
});
