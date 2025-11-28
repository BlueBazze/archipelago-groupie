<script setup lang="ts">
const router = useRouter();
const toast = useToast();

const instance = getCurrentInstance();
const uploadFileContent = useUploadFileContent();

const bodyEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (import.meta.client) {
    bodyEl.value = document.body;
  }
});

const { files, isOverDropZone } = useDropZone(bodyEl, {
  // dataTypes: ["text/yaml", "text/x-yaml", "application/x-yaml"],
  multiple: false,
  onDrop: async (files) => {
    if (!files || files.length === 0 || !files[0]) return;

    const file = files[0];

    if (!file.name.endsWith(".yaml") && !file.name.endsWith(".yml")) {
      toast.add({
        title: "File must be a YAML file",
        color: "error",
      });
      return;
    }

    console.log(file.type, file.name, file.size);

    // Validate file extension
    if (!file.name.match(/\.ya?ml$/i)) {
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: "File size must be less than 5MB",
        color: "error",
      });
      return;
    }

    try {
      // Read file content
      const content = await file.text();

      // Parse YAML to validate it
      parseYAML(content);

      // Extract game name from filename (without extension)
      const gameName = file.name.replace(/\.ya?ml$/i, "");

      uploadFileContent.value = content;

      // Navigate to new game page with data
      navigateTo({
        path: "/my/games/new",

        // state: {
        //   content: content,
        // },
        // query: {
        //   content: content,
        // },
      });
    } catch (err: any) {
      toast.add({
        title: "Failed to parse YAML file",
        description: err.message,
        color: "error",
      });
    }
  },
});
</script>

<template>
  <!-- This component has no template, it only provides drop zone functionality -->
  <div>
    <slot />
  </div>
</template>
