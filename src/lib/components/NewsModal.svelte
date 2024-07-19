<script>
  export let title;
  export let content;
  export let time;
  export let Sentiment;
  export let date;
  export let image;
  export let id;
</script>


<!-- Desktop modal using dialog component -->
<input type="checkbox" {id} class="modal-toggle" />

<dialog {id} class="modal modal-bottom sm:modal-middle">
  <label
    for={id}
    class="cursor-pointer modal-backdrop bg-[#0d1117] bg-opacity-[0.5]"
  ></label>

  <!-- Desktop modal content -->
  <div
    class="modal-box w-full bg-[#0d1117] border border-[#2a2e39] flex flex-col items-center"
  >
    <div
      class="mx-auto mb-8 h-1.5 w-30 flex-shrink-0 rounded-full bg-[#2a2e39]"
    />
    <div
      class="flex items-center justify-between w-full gap-x-4 text-xs cursor-pointer"
    >
      <div class="text-white-500">{time} · {date}</div>

      <div class="flex items-center gap-x-4 text-xs">
        <div class="text-white-500 text-xs">Sentiment :</div>

        <div
          class={`relative z-10 rounded-full ${Sentiment === "negative" ? "bg-red-600" : Sentiment === "positive" ? "bg-green-600" : "bg-purple-600"} px-3 py-1.5 font-medium text-white hover:bg-purple-400`}
        >
          {Sentiment}
        </div>
      </div>
    </div>
    <div class="relative mt-3 flex items-center gap-x-4">
      <img src={image} alt="" class="h-10 w-10 rounded-full bg-gray-50" />
      <div class="text-sm leading-6">
        <div
          class="text-2xl font-bold text-white cursor-pointer hover:underline mt-5 mb-5"
        >
          {title}
        </div>
      </div>
    </div>
    <div class="group relative">
      <p class="text-white text-sm mt-2">
        {@html content}
      </p>
    </div>

    <label
      for={id}
      class="sm:hidden cursor-pointer px-7 py-2 mb-5 rounded-full bg-[#0DDE00] text-center text-black text-[1rem] font-normal"
      >OK</label
    >
  </div>
</dialog>
