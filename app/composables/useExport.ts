export const useExport = () => {
  const loading = ref(false);

  const exportAllGames = async () => {
    loading.value = true;

    try {
      const data = await $fetch<ArrayBuffer>("/api/admin/export", {
        method: "GET",
        responseType: "arrayBuffer",
      });

      const blob = new Blob([data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const timestamp = new Date().toISOString().split("T")[0];
      link.download = `archipelago-yamls-${timestamp}.zip`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Export failed: ${err.message || err}`);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    exportAllGames,
  };
};





