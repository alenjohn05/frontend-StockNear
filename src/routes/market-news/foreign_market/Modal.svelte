<!-- Modal.svelte -->
<script>
    export let article;
  
    function closeModal() {
      // Logic to close modal
    }
  </script>
  
  <div class="modal">
    <div class="modal-content">
      <span class="close" on:click={closeModal}>&times;</span>
      <div class="modal-header">
        <h2>{article.heading}</h2>
      </div>
      <div class="modal-body">
        <img src={article.IllustrationImage} alt={article.heading} />
        <p>{article.Arttext}</p>
      </div>
    </div>
  </div>
  